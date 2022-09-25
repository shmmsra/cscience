#!/usr/bin/env node
const os = require('os');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const yargs = require('yargs');
const shortid = require('shortid');
const Jimp = require('jimp');
const pngFileStream = require('png-file-stream');
const GIFEncoder = require('gifencoder');

// In portrait mode, size of A4 sheet in pixel assuming 300ppi
const A4 = {
    height: 3508,
    width: 2480,
};

const argv = yargs(process.argv.slice(2))
    .usage('Usage: yarn <command> [options]')
    .command('moire', 'Create moire patten from input files').example('yarn moire')
    .options({
        'input': {
            alias: 'i',
            describe: 'Input directory path containing the source images only',
            demandOption: true,
        },
        'output': {
            alias: 'o',
            describe: 'Output directory path for the results',
            demandOption: true,
        },
        'background': {
            alias: 'b',
            describe: 'Background for the generated moire image',
            default: '#FFFFFF',
        },
        'color': {
            alias: 'c',
            describe: 'Color for the generated mask image',
            default: '#FFFFFF',
        },
      })
    .help('h').alias('h', 'help')
    .strict()
    .argv;

console.info('\x1b[34m%s\x1b[0m', `Commands: argv: `, argv);

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function createVerticalStripesMask(height, color, unit, count, loops, maskOutputPath, cb) {
    const mask = [];
    for (let index = 0; index < loops; ++index) {
        mask.push(...Array(count - 1).fill(1).concat(0));
    }
    console.info("createVerticalStripesMask: mask length:", mask.length);

    const width = unit * mask.length;
    new Jimp(width, height, (err, image) => {
        for (let index = 0; index < mask.length; ++index) {
            const colorRGB = hexToRgb(color);
            const c = {
                red: mask[index] ? colorRGB.r : 0,
                green: mask[index] ? colorRGB.g : 0,
                blue: mask[index] ? colorRGB.b : 0,
                alpha: mask[index] ? 255 : 0,
            };
            image.scan(
                index * unit,
                0,
                unit,
                height,
                function(x, y, idx) {
                    // x, y is the position of this pixel on the image
                    // idx is the position start position of this rgba tuple in the bitmap Buffer
                    // this is the image
                
                    image.bitmap.data[idx + 0] = c.red;
                    image.bitmap.data[idx + 1] = c.green;
                    image.bitmap.data[idx + 2] = c.blue;
                    image.bitmap.data[idx + 3] = c.alpha;
                
                    // rgba values run from 0 - 255
                    // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
                }
            );
        }

        image.quality(100);
        image.write(maskOutputPath);
        cb(null, image);
    });
}

function createMoireImage(paths, unit, padding, background, moireOutputPath, cb) {
    console.info("createMoireImage: start: unit:", unit);

    Promise.all(paths.map((path) => Jimp.read(path))).then(images => {
        const count = images.length;
        let width = images.reduce((previous, current) => {
            return (previous > current.bitmap.width)
                ? previous : current.bitmap.width
        }, 0);
        let height = images.reduce((previous, current) => {
            return (previous > current.bitmap.height)
                ? previous : current.bitmap.height
        }, 0);
        console.info("createMoireImage: count:", count, ", width:", width, ", height:", height);

        const scale = Math.floor(A4.width / 4) / width;
        images.forEach(image => {
            image.scale(scale);
        });
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
        console.info("createMoireImage: scale factor:", scale, ", width:", width, ", height:", height);

        new Jimp(width, height, background, (err, moireImage) => {
            images.forEach((image, position) => {
                const loops = Math.ceil((image.bitmap.width / (unit * count)));

                for (let index = 0; index < loops; ++index) {
                    image.scan(
                        ((count * index) + position) * unit,
                        0,
                        unit,
                        image.bitmap.height,
                        function(x, y, idx) {
                            const targetIdx = moireImage.getPixelIndex(x, y);
                            if (image.bitmap.data[idx + 3]) {
                                moireImage.bitmap.data[targetIdx + 0] = image.bitmap.data[idx + 0];
                                moireImage.bitmap.data[targetIdx + 1] = image.bitmap.data[idx + 1];
                                moireImage.bitmap.data[targetIdx + 2] = image.bitmap.data[idx + 2];
                                moireImage.bitmap.data[targetIdx + 3] = image.bitmap.data[idx + 3];
                            }
                        }
                    )
                }
            });

            if (padding) {
                const pad = Math.floor(width * padding / 2);
                console.info("createMoireImage: add padding on each side: pad:", pad);
                new Jimp(pad + width + pad, pad + height + pad, background, (err, paddedMoireImage) => {
                    paddedMoireImage.blit(moireImage, pad, pad);
                    paddedMoireImage.quality(100);
                    paddedMoireImage.write(moireOutputPath);
                    cb(null, paddedMoireImage);
                });
            } else {
                moireImage.quality(100);
                moireImage.write(moireOutputPath);
                cb(null, moireImage);
            }
        });
    });
}

function createAnimationFrames(moireImagePath, maskImagePath, unit, output, cb) {
    console.info("createAnimationFrames: start: unit:", unit, ", output directory:", output);
    const frames = [];

    Jimp.read(moireImagePath, (err, moireImage) => {
        Jimp.read(maskImagePath, (err, maskImage) => {
            const frameCount = Math.floor((maskImage.bitmap.width - moireImage.bitmap.width) / unit);
            console.info("createAnimationFrames: frameCount:", frameCount);

            const width = moireImage.bitmap.width;
            const height = moireImage.bitmap.height;
            for (let index = 0; index < frameCount; ++index) {
                const imageFrame = moireImage.clone();
                const maskFrame = maskImage.clone();
                maskFrame.crop(index * unit, 0, width, height);
                imageFrame.scan(
                    0,
                    0,
                    width,
                    height,
                    function(x, y, idx) {
                        const maskIdx = maskFrame.getPixelIndex(x, y);
                        if (maskFrame.bitmap.data[maskIdx + 3]) {
                            imageFrame.bitmap.data[idx + 0] = maskFrame.bitmap.data[idx + 0];
                            imageFrame.bitmap.data[idx + 1] = maskFrame.bitmap.data[idx + 1];
                            imageFrame.bitmap.data[idx + 2] = maskFrame.bitmap.data[idx + 2];
                            imageFrame.bitmap.data[idx + 3] = maskFrame.bitmap.data[idx + 3];
                        }
                    }
                );
                imageFrame.quality(100);
                const framePath = path.join(output, `frame-${String(index).padStart(5, '0')}.png`);
                imageFrame.write(framePath);
                frames.push(framePath);
            }

            cb(null, width, height, frames, output);
        });
    });
}

function createGif(width, height, source, options, output, cb) {
    console.info("createGif: start: width:", width, ", height:", height, ", source:", source);
    const encoder = new GIFEncoder(width, height);
    encoder.setTransparent(0);
    const stream = pngFileStream(path.join(source, `frame-?????.png`))
        .pipe(encoder.createWriteStream(options))
        .pipe(fs.createWriteStream(output));
   
    stream.on('finish', function () {
        cb(null, output);
    });
    stream.on('error', function (err, stdout, stderr) {
        console.error("createGif: error:", err);
    });
}

function createA4Print(moireImage, maskImage, a4OutputPath, cb) {
    new Jimp(A4.width, A4.height, '#FFFFFF', (err, a4Image) => {
        const moireX = Math.floor((A4.width - moireImage.bitmap.width) / 2);
        const moireY = 64;
        a4Image.blit(moireImage, moireX, moireY);

        const maskX = Math.floor((A4.width - maskImage.bitmap.width) / 2);
        const maskY = moireY + moireImage.bitmap.height + moireY + 64;
        a4Image.blit(maskImage, maskX, maskY);

        a4Image.quality(100);
        a4Image.write(a4OutputPath);
        cb(null, a4Image);
    });
}

function main() {
    console.info("main: start");

    glob(argv.input, function(err, paths) {
        console.info("main: input file list:", paths);

        const moireOutputPath = path.join(argv.output, './moire.png');
        const maskOutputPath = path.join(argv.output, './mask.png');
        const a4OutputPath = path.join(argv.output, './a4.png');
        const framesOutputPath = path.resolve(os.tmpdir(), 'moire-video-frames', shortid.generate());
        const animationOutputPath = path.join(argv.output, './animation.gif');

        const unit = 16;
        const padding = 0.4; // 30% margin on top and bottom
        createMoireImage(paths, unit, padding, argv.background, moireOutputPath, (err, moireImage) => {
            console.info("main: moire image generated:", moireOutputPath);

            const count = paths.length;
            const loops = Math.floor((moireImage.bitmap.width / (unit * count))) * 2; // 100% margin on left and right
            const height = moireImage.bitmap.height;
            createVerticalStripesMask(height, argv.color, unit, count, loops, maskOutputPath, (err, maskImage) => {
                console.info("main: mask image generated:", maskOutputPath);

                createA4Print(moireImage, maskImage, a4OutputPath, function(err) {
                    console.info("main: A4 image generated:", a4OutputPath);

                    createAnimationFrames(moireOutputPath, maskOutputPath, 2, framesOutputPath, (err, width, height) => {
                        console.info("main: animation frames generated:", framesOutputPath);

                        const options = { repeat: -1, delay: 40, quality: 5 };
                        createGif(width, height, framesOutputPath, options, animationOutputPath, (err) => {
                            console.info("main: gif generated:", animationOutputPath);
                        });
                    });
                });
            });
        });
    });
}
main();

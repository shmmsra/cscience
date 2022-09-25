#!/usr/bin/env node
const os = require('os');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const shortid = require('shortid');
const Jimp = require('jimp');
const videoshow = require('videoshow');
const canvas = require('canvas');
const pngFileStream = require('png-file-stream');
const GIFEncoder = require('gifencoder');

const args = {
    paths: [
        './in-1.png',
        './in-2.png',
        './in-3.png',
        './in-1.png',
    ],
    frames: [
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-0.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-1.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-2.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-3.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-4.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-5.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-6.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-7.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-8.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-9.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-10.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-11.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-12.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-13.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-14.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-15.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-16.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-17.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-18.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-19.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-20.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-21.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-22.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-23.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-24.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-25.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-26.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-27.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-28.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-29.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-30.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-31.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-32.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-33.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-34.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-35.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-36.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-37.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-38.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-39.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-40.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-41.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-42.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-43.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-44.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-45.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-46.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-47.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-48.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-49.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-50.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-51.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-52.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-53.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-54.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-55.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-56.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-57.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-58.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-59.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-60.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-61.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-62.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-63.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-64.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-65.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-66.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-67.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-68.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-69.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-70.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-71.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-72.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-73.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-74.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-75.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-76.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-77.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-78.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-79.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-80.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-81.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-82.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-83.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-84.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-85.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-86.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-87.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-88.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-89.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-90.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-91.png',
        '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU/frame-92.png'
    ],
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

function createVerticalStripesMask(height, color, unit, count, loops, cb) {
    const mask = [];
    for (let index = 0; index < loops; ++index) {
        mask.push(...Array(count - 1).fill(1).concat(0));
    }
    console.info("createVerticalStripesMask: mask length:", mask.length, ", mask:", mask);

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
        cb(null, image);
    });
}

function createMoireImage(paths, unit, padding, background, cb) {
    console.info("createMoireImage: start: unit:", unit, ", paths:", paths);

    Promise.all(paths.map((path) => Jimp.read(path))).then(images => {
        const count = images.length;
        const width = images.reduce((previous, current) => {
            return (previous > current.bitmap.width)
                ? previous : current.bitmap.width
        }, 0);
        const height = images.reduce((previous, current) => {
            return (previous > current.bitmap.height)
                ? previous : current.bitmap.height
        }, 0);
        console.info("createMoireImage: count:", count, ", width:", width, ", height:", height);

        new Jimp(width, height, background, (err, moireImage) => {
            images.forEach((image, position) => {
                const loops = Math.floor((image.bitmap.width / (unit * count)));
                console.info("createMoireImage: position:", position, ", loops:", loops);

                for (let index = 0; index < loops; ++index) {
                    image.scan(
                        ((count * index) + position) * unit,
                        0,
                        unit,
                        image.bitmap.height,
                        function(x, y, idx) {
                            const targetIdx = moireImage.getPixelIndex(x, y);
                            moireImage.bitmap.data[targetIdx + 0] = image.bitmap.data[idx + 0];
                            moireImage.bitmap.data[targetIdx + 1] = image.bitmap.data[idx + 1];
                            moireImage.bitmap.data[targetIdx + 2] = image.bitmap.data[idx + 2];
                            moireImage.bitmap.data[targetIdx + 3] = image.bitmap.data[idx + 3];
                        }
                    )
                }
            });

            if (padding) {
                const pad = Math.floor(width * padding / 2);
                new Jimp(pad + width + pad, pad + height + pad, (err, paddedMoireImage) => {
                    paddedMoireImage.blit(moireImage, pad, pad);
                    cb(null, paddedMoireImage);
                });
            } else {
                cb(null, moireImage);
            }
        });
    });
}

function createAnimationFrames(moireImagePath, maskImagePath, unit, cb) {
    const tmpDir = path.resolve(os.tmpdir(), 'moire-video-frames', shortid.generate());
    console.info("createAnimationFrames: start: unit:", unit, ", tmpDir:", tmpDir);
    const frames = [];

    Jimp.read(moireImagePath, (err, moireImage) => {
        Jimp.read(maskImagePath, (err, maskImage) => {
            const frameCount = Math.floor((maskImage.bitmap.width - moireImage.bitmap.width) / unit);
            console.info("createAnimationFrames: frameCount:", frameCount);

            for (let index = 0; index < frameCount; ++index) {
                const imageFrame = moireImage.clone();
                const maskFrame = maskImage.clone();
                maskFrame.crop(index * unit, 0, imageFrame.bitmap.width, imageFrame.bitmap.height);
                imageFrame.scan(
                    0,
                    0,
                    imageFrame.bitmap.width,
                    imageFrame.bitmap.height,
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
                const framePath = path.join(tmpDir, `frame-${String(index).padStart(4, '0')}.png`);
                imageFrame.write(framePath);
                frames.push(framePath);
            }

            cb(frames, tmpDir);
        });
    });
}

function createVideo(images, duration) {
    const fps = images.length / duration;
    console.info("createVideo: fps:", fps);
    const videoOptions = {
        fps: fps,
        // duration: duration,
        loop: 1 / fps,
        transition: false,
        videoBitrate: 1024,
        videoCodec: 'libx264',
        format: 'mp4',
        pixelFormat: 'yuv420p'
    };
      
    videoshow(images, videoOptions)
        .save('video.mp4')
        .on('start', function (command) {
            // console.log('createVideo: ffmpeg process started:', command)
        })
        .on('error', function (err, stdout, stderr) {
            console.error('createVideo: error:', err)
            console.error('createVideo: ffmpeg stderr:', stderr)
        })
        .on('end', function (output) {
            console.error('createVideo: video created in:', output)
        })
}

function createGif(images, duration, tmpDir, cb) {
    // Promise.all(images.map(image => Jimp.read(image))).then((values) => {
    //     const encoder = new GIFEncoder(values[0].bitmap.width, values[0].bitmap.height);
    //     encoder.createReadStream().pipe(fs.createWriteStream('myAnimated.gif'));
    //     encoder.start();
    //     encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    //     encoder.setDelay(500);  // frame delay in ms
    //     encoder.setQuality(10); // image quality. 10 is default.        

    //     const imageData = new canvas.ImageData(
    //         new Uint8ClampedArray(values[0].bitmap.data),
    //         values[0].bitmap.width,
    //         values[0].bitmap.height
    //     );
    //     const ctx = canvas.createCanvas().getContext('2d');
    //     ctx.putImageData(imageData, 0, 0);
    //     encoder.addFrame(ctx);

    //     encoder.finish();
    // });


    // Promise.all([images[0]].map(image => {
    //     console.info("createGif: loadImage: image:", image);
    //     return canvas.loadImage(image);
    // })).then((values) => {
    //     const encoder = new GIFEncoder(404, 406);
    //     encoder.createReadStream().pipe(fs.createWriteStream('myAnimated.gif'));
    //     encoder.start();
    //     encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    //     encoder.setDelay(500);  // frame delay in ms
    //     encoder.setQuality(10); // image quality. 10 is default.        

    //     values.forEach((value) => {
    //         const ctx = canvas.createCanvas(404, 406).getContext('2d');
    //         ctx.drawImage(value, 0, 0, 404, 406);
    //         encoder.addFrame(ctx);
    //     })

    //     encoder.finish();
    // });

    const encoder = new GIFEncoder(404, 406);
    const stream = pngFileStream(path.join(tmpDir, `frame-????.png`))
        .pipe(encoder.createWriteStream({ repeat: -1, delay: 20, quality: 5 }))
        .pipe(fs.createWriteStream('myAnimated.gif'));
   
    stream.on('finish', function () {
        cb();
    });
    stream.on('error', function (err, stdout, stderr) {
    });
}

function main() {
    console.info("main: start");

    const unit = 8;
    const padding = 0.2; // 10% margin on top and bottom
    const background = 0x00ff00ff;

    createMoireImage(args.paths, unit, padding, background, (err, moireImage) => {
        moireImage.quality(100);
        moireImage.write('./moire.png');
        console.info("main: moire image generated");

        const count = args.paths.length;
        const loops = Math.floor((moireImage.bitmap.width / (unit * count))) * 3; // 100% margin on left and right
        const height = moireImage.bitmap.height;
        createVerticalStripesMask(height, '#FF0000', unit, count, loops, (err, maskImage) => {
            maskImage.quality(100);
            maskImage.write('./mask.png');
            console.info("main: mask image generated");

            createAnimationFrames('./moire.png', './mask.png', 2, (frames, tmpDir) => {
                // createVideo(frames, 4, tmpDir);
                createGif(frames, 4, tmpDir, () => {
                    console.info("main: gif generated");
                });
            });
        });
    });


    // createVideo(args.frames, 4);
    // createGif(args.frames, 4, '/var/folders/1v/qynttb5s6_d_38lqx8qq8sv00000gn/T/moire-video-frames/ohJGkubFU');
}
main();

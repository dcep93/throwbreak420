import imageio
import numpy

# grounded 60
# 1:   0:01-0:04 grounded/1.mkv 110 200
# 2:   0:08-0:11 grounded/2.mkv 528 618
# 1+2: 0:13-0:16 grounded/12.mkv 836 926
# standing 66
# 1:   1:20-1:27 standing/1.mkv 4855 5060
# 2:   0:54-1:01 standing/2.mkv 3326 3531
# 1+2: 1:00-1:06 standing/12.mkv 3745 3950

def main():
    vid = imageio.get_reader('raw.mkv',  'ffmpeg')
    data = []
    for num, image in enumerate(vid.iter_data()):
        data.append(numpy.asarray(image))
    while True:
        cmd = input('cmd\n')
        path, start, end = cmd.split(' ')
        writer = imageio.get_writer(path, fps=60)
        for img in data[int(start):int(end)]:
            writer.append_data(img)
        writer.close()

main()

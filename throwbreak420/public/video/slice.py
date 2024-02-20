import imageio
import numpy


# seconds path usable_start move usable_end
# 42  min(move-usable_start)
# 217 min<standing>(usable_end-move)
# 85  min<grounded>(usable_end-move)
# standing
# p1
# 1:    2- 8 p1/standing/1.mp4 128 250 509
# 2:   12-18 p1/standing/2.mp4 765 886 1126
# 1+2: 24-30 p1/standing/12.mp4 1433 1553 1770
# p2
# 1:   109-113 p2/standing/1.mp4 6499 6578 6795
# 2:    89- 93 p2/standing/2.mp4 5325 5410 5627
# 1+2:  77- 82 p2/standing/12.mp4 4578 4646 4863
# grounded
# p1
# 1:   138-141 p1/grounded/1.mp4 8307 8398 8615
# 2:   157-160 p1/grounded/2.mp4 9464 9508 9611
# 1+2: 166-169 p1/grounded/12.mp4 10033 10089 10185
# p2
# 1:   199-203 p2/grounded/1.mp4 11959 12041 12137
# 2:   191-194 p2/grounded/2.mp4 11507 11568 11657
# 1+2: 182-186 p2/grounded/12.mp4 11010 11076 11161

# filename=p1/standing/12.mp4; start_frame=120; end_frame=480; rm $filename; ffmpeg -i raw.mkv -vf "select=between(n\,$start_frame\,$end_frame),setpts=PTS-STARTPTS" -af "aselect=between(n\,$start_frame\,$end_frame),asetpts=PTS-STARTPTS" -filter:v scale=960:-1 $filename


def main():
    vid = imageio.get_reader('960.mkv',  'ffmpeg')
    data = []
    for num, raw in enumerate(vid.iter_data()):
        img = numpy.asarray(raw)
        # img = resize(img, (540, 960, 3)) # (1080, 1920, 3)
        data.append(img)
    while True:
        cmd = input('cmd\n')

        path, start, move, end = cmd.split(' ')
        move = int(move)
        start = move - 42
        end = move + 217 if 'standing' in path else move + 85

        writer = imageio.get_writer(path, fps=60)
        for img in data[int(start):int(end)]:
            writer.append_data(img)
        writer.close()

main()

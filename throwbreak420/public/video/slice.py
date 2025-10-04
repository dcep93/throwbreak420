import traceback

import imageio  # type: ignore
import numpy

# ffmpeg -i raw.mkv -filter:v scale=960:-1 -c:a copy 960.mkv
# seconds path move usable_start usable_end
# 42  min(move-usable_start)
# 128 min<standing>(usable_end-move)
# 63  min<grounded>(usable_end-move)
# standing
# p1
# 1:    540 p1/standing/1.mp4 611 520 792
# 2:   1260 p1/standing/2.mp4 1235 1147 1373
# 1+2: 1680 p1/standing/12.mp4 1719 1620 1885
# p2
# 1:   6840 p2/standing/1.mp4 6851 6807 7025
# 2:   6120 p2/standing/2.mp4 6135 6077 6263
# 1+2: 5520 p2/standing/12.mp4 5589 5507 5745
# grounded
# p1
# 1:   3300 p1/grounded/1.mp4 3360 3200 3460
# 2:   3660 p1/grounded/2.mp4 3712 3644 3795
# 1+2: 4020 p1/grounded/12.mp4 4065 3987 4150
# p2
# 1:   7500 p2/grounded/1.mp4 7572 7492 7635
# 2:   8460 p2/grounded/2.mp4 8514 8435 8585
# 1+2: 8940 p2/grounded/12.mp4 8997 8922 9250


def main():
    vid = imageio.get_reader("960.mkv", "ffmpeg")
    data = []
    for num, raw in enumerate(vid.iter_data()):
        img = numpy.asarray(raw)
        data.append(img)
    while True:
        cmd = input("cmd\n")
        try:
            # path, start, end = cmd.split(' ')
            path, move = cmd.split(" ")
            move = int(move)
            start = move - 42
            end = move + 128 if "standing" in path else move + 63

            writer = imageio.get_writer(path, fps=60)
            for img in data[int(start) : int(end)]:
                writer.append_data(img)
            writer.close()
        except:
            print(traceback.format_exc())


main()

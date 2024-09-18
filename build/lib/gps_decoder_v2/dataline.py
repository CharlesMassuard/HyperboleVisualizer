class Dataline:
    def __init__(self, index, heure, minute, seconde, d_lat, d_lon, quality, x, y, per_x, per_y, pix_x, pix_y, ah, v, a, s, d, deg, rpm):
        self.index = index
        self.heure = heure
        self.minute = minute
        self.seconde = seconde
        self.d_lat = d_lat
        self.d_lon = d_lon
        self.quality = quality
        self.x = x
        self.y = y
        self.per_x = per_x
        self.per_y = per_y
        self.pix_x = pix_x
        self.pix_y = pix_y
        self.ah = ah
        self.v = v
        self.a = a
        self.s = s
        self.d = d
        self.deg = deg
        self.rpm = rpm
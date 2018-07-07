package stivik.vv.p02.models;

import java.io.Serializable;
import java.util.Random;

public class GPSPosition implements Serializable {
    public double x;
    public double y;
    public double z;

    private static Random random = new Random();

    public GPSPosition(double x, double y, double z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static GPSPosition getRandom() {
        return new GPSPosition(random.nextDouble(), random.nextDouble(), random.nextDouble());
    }
}

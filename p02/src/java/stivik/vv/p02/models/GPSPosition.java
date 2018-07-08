package stivik.vv.p02.models;

import java.io.Serializable;
import java.util.Random;
import java.util.concurrent.Callable;

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
        Callable<Double> randomDouble = () -> ( random.nextInt(50000) / 10d );

        try {
            return new GPSPosition(randomDouble.call(), randomDouble.call(), randomDouble.call());
        } catch (Exception ignored) {}

        return new GPSPosition(0d, 0d, 0d);
    }

    @Override
    public String toString() {
        return "GPSPosition { " +
                "x=" + x +
                ", y=" + y +
                ", z=" + z +
                " }";
    }
}

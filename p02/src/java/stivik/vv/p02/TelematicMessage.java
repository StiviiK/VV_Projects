package stivik.vv.p02;

import stivik.vv.p02.models.GPSPosition;

import java.io.Serializable;

public class TelematicMessage implements Serializable {
    private int UnitId;
    private int Distance;
    private long Time;
    private GPSPosition Position;

    public TelematicMessage(int unitId, int distance, long time, GPSPosition position) {
        UnitId = unitId;
        Distance = distance;
        Time = time;
        Position = position;
    }

    public int getUnitId() {
        return UnitId;
    }

    public int getDistance() {
        return Distance;
    }

    public long getTime() {
        return Time;
    }

    public GPSPosition getPosition() {
        return Position;
    }
}

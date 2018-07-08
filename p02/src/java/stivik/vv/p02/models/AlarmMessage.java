package stivik.vv.p02.models;

public class AlarmMessage extends TelematicMessage {
    public AlarmMessage(int unitId, int distance, long time, GPSPosition position) {
        super(unitId, distance, time, position);
    }
}

package stivik.vv.p00.util;

@FunctionalInterface
public interface Callback<T> {
    void call(T result);
}

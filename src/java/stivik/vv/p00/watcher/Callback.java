package stivik.vv.p00.watcher;

@FunctionalInterface
public interface Callback<T> {
    void call(T result);
}

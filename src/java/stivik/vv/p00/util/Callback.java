package stivik.vv.p00.util;

/**
 @Purpose Represents a callback (lambda) method with 1 parameter of type T
 **/
@FunctionalInterface
public interface Callback<T> {
    void call(T result);
}

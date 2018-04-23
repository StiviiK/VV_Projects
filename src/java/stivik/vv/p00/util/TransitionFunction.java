package stivik.vv.p00.util;

@FunctionalInterface
public interface TransitionFunction<TYPE_A, TYPE_B, TRANSITION> {
    TRANSITION transform(TYPE_A a, TYPE_B b);
}

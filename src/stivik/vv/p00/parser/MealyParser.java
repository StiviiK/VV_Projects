package stivik.vv.p00.parser;

import stivik.vv.p00.MealyStateMachineFile;

import java.io.File;

public interface MealyParser {
    MealyStateMachineFile parse(File constructFile);
}

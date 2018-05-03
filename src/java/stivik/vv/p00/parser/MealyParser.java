package stivik.vv.p00.parser;

import stivik.vv.p00.models.MealyStateMachineFile;

import sun.reflect.generics.reflectiveObjects.NotImplementedException;
import java.io.File;

/**
 * @Purpose Reserves the ability to builds machines from different data file formats
 **/
public interface MealyParser {
    static MealyStateMachineFile parse(File constructFile) throws Exception {
        throw new NotImplementedException();
    }
}

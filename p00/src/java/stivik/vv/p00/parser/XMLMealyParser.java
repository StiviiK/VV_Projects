package stivik.vv.p00.parser;

import stivik.vv.p00.models.MealyStateMachineFile;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;

/**
 * @Purpose An implementation to build machines from XML files
 **/
public class XMLMealyParser implements MealyParser {
    public static MealyStateMachineFile parse(File constructFile) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(MealyStateMachineFile.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();

        return (MealyStateMachineFile) unmarshaller.unmarshal(constructFile);
    }
}

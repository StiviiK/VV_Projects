package stivik.vv.p00.parser;

import stivik.vv.p00.MealyStateMachineFile;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;

public class XMLMealyParser implements MealyParser {
    public static MealyStateMachineFile parse(File constructFile) throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(MealyStateMachineFile.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();

        return (MealyStateMachineFile) unmarshaller.unmarshal(constructFile);
    }
}

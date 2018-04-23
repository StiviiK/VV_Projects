package stivik.vv.p00.parser;

import org.xml.sax.SAXException;
import stivik.vv.p00.MealyStateMachineFile;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

import javax.xml.bind.JAXBException;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;

public interface MealyParser {
    MealyStateMachineFile parse(File constructFile) throws Exception;
}

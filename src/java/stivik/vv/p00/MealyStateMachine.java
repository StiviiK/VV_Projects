package stivik.vv.p00;

import stivik.vv.p00.models.*;
import stivik.vv.p00.parser.XMLMealyParser;
import stivik.vv.p00.util.*;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.Scanner;
import java.util.concurrent.BlockingQueue;

public class MealyStateMachine {

    private TransitionMap<State> m_StateTransitionMap = new TransitionMap<>();
    private TransitionMap<TransitionFunction<State, Symbol, Symbol>> m_SymbolTransitionMap = new TransitionMap<>();

    private Scanner m_InputReader = new Scanner(System.in);
    private State m_CurrentState;
    private State[] m_States;
    private Symbol[] m_Symbols;

    private Thread executor;
    private BlockingQueue<InputSymbol> queue;
    private MealyInputReader inputReader;

    public MealyStateMachine(State[] states, Symbol[] symbols) {
        m_States = states;
        m_Symbols = symbols;
        m_CurrentState = m_States[0];

        try {
            executor = new Thread(this::loop);
            inputReader = new MealyInputReader(Paths.get("src/java/stivik/vv/p00/resources/input"));
            queue = inputReader.getQueue();

            executor.start();
            executor.join();
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void addTransition(Transition transition) {
        m_StateTransitionMap.put(transition.getFromState(), transition.getInputSymbol(), transition.getToState());
        m_SymbolTransitionMap.put(transition.getFromState(), transition.getInputSymbol(), ((state, symbol) -> transition.getOutputSymbol()));
    }

    private void loop() {
        inputReader.start();
        while (true) {
            try {
                InputSymbol input = queue.take();
                System.out.println(input.getSymbol());
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }

    public void run() {
        StringBuilder builder = new StringBuilder();
        builder.append("START");
        while(true) {
            builder.append(" -> (").append("STATE: ").append(m_CurrentState.name).append(", INPUT: ");

            System.out.print(builder);

            int input = m_InputReader.nextInt();

            builder.append(input).append(", ").append("OUTPUT: ").append(trigger(m_CurrentState, m_Symbols[input]).getName()).append(")");
            m_CurrentState = next(m_CurrentState, m_Symbols[input]);
            if (m_CurrentState.isEnd) {
                break;
            }
        }

        builder.append(" -> END");
        System.out.println(builder);
    }

    // Zustandsübergang
    public State next(State currentState, Symbol input) {
        return m_StateTransitionMap.get(currentState, input);
    }

    // Ausgabe
    public Symbol trigger(State currentState, Symbol input) {
        return m_SymbolTransitionMap.get(currentState, input).transform(currentState, input);
    }

    public static void main(String[] args) throws JAXBException, InterruptedException {
        File file = new File("src/java/stivik/vv/p00/resources/machine.xml");
        JAXBContext context = JAXBContext.newInstance(MealyStateMachineFile.class);
        /*
        MealyStateMachineFile machineFile = new MealyStateMachineFile();
        JAXBContext context = JAXBContext.newInstance(MealyStateMachineFile.class);
        Marshaller m = context.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
        m.marshal(machineFile, System.out);
        m.marshal(machineFile, file);
        */

        MealyStateMachine machine = MealyStateMachineFactory.build(XMLMealyParser.parse(file));
        //machine.run();
    }
}

/**
    java -jar mealy.jar -machine=./file.json -format=json -input=./input.txt -output =./output.txt

    input.txt:
    "0,0,0,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,2"
 **/
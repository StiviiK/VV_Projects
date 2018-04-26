package stivik.vv.p00;

import stivik.vv.p00.io.MealyInputReader;
import stivik.vv.p00.models.*;
import stivik.vv.p00.parser.XMLMealyParser;
import stivik.vv.p00.util.*;

import javax.xml.bind.JAXBException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.concurrent.BlockingQueue;

public class MealyStateMachine {
    private Thread machineRunner;
    private BlockingQueue<InputSymbol> queue;
    private MealyInputReader inputReader;
    private TransitionMap<State> stateTransitionMap = new TransitionMap<>();
    private TransitionMap<Symbol> symbolTransitionMao = new TransitionMap<>();
    private State m_CurrentState;

    public MealyStateMachine(State[] states, Symbol[] symbols) {
        m_CurrentState = states[0];

        try {
            machineRunner = new Thread(this::loop);
            inputReader = new MealyInputReader(Paths.get("resources/input"));
            queue = inputReader.getQueue();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void addTransition(Transition transition) {
        stateTransitionMap.put(transition.getFromState(), transition.getInputSymbol(), transition.getToState());
        symbolTransitionMao.put(transition.getFromState(), transition.getInputSymbol(), transition.getOutputSymbol());
    }

    public void start() {
        inputReader.start();
        machineRunner.start();
    }

    public void stop() {
        inputReader.stop();
        machineRunner.interrupt();
    }

    private void loop() {
        StringBuilder builder = new StringBuilder();
        builder.append("START");

        while (true) {
            try {
                builder.append(" -> (").append("STATE: ").append(m_CurrentState.name).append(", INPUT: ");

                System.out.print(builder);

                InputSymbol input = queue.take();
                Symbol inputSymbol = input.getSymbol();
                System.out.println(input.getSymbol());

                builder.append(inputSymbol.getName()).append(", ").append("OUTPUT: ").append(getOutputSymbol(m_CurrentState, inputSymbol).getName()).append(")");
                m_CurrentState = getNextState(m_CurrentState, inputSymbol);
                if (m_CurrentState.isEnd) {
                    break;
                }
            } catch (InterruptedException e) {
                break;
            }
        }

        stop();
    }

    private Symbol getOutputSymbol(State currentState, Symbol input) {
        return symbolTransitionMao.get(currentState, input);
    }

    private State getNextState(State currentState, Symbol input) {
        return stateTransitionMap.get(currentState, input);
    }

    public static void main(String[] args) throws JAXBException, InterruptedException {
        File file = new File("resources/machine.xml");
        MealyStateMachine machine = MealyStateMachineFactory.build(XMLMealyParser.parse(file));
        machine.start();
        System.out.println("hi");
    }
}

/**
    java -jar mealy.jar -machine=./file.json -format=json -input=./input.txt -output =./output.txt

    input.txt:
    "0,0,0,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,2"
 **/
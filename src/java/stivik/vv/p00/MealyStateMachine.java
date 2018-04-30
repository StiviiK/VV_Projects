package stivik.vv.p00;

import stivik.vv.p00.io.MealyInputReader;
import stivik.vv.p00.io.MealyOutputWriter;
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
    private BlockingQueue<InputSymbol> inputQueue;
    private BlockingQueue<Symbol> outputQueue;
    private MealyInputReader inputReader;
    private MealyOutputWriter outputWriter;
    private TransitionMap<State> stateTransitionMap = new TransitionMap<>();
    private TransitionMap<Symbol> symbolTransitionMap = new TransitionMap<>();
    private State m_CurrentState;

    public MealyStateMachine(State[] states, Symbol[] symbols) {
        m_CurrentState = states[0];

        try {
            machineRunner = new Thread(this::loop);
            inputReader = new MealyInputReader(Paths.get("resources/input"));
            outputWriter = new MealyOutputWriter(Paths.get("resources/output"));
            inputQueue = inputReader.getQueue();
            outputQueue = outputWriter.getQueue();
        } catch (IOException | JAXBException e) {
            e.printStackTrace();
        }
    }

    public void addTransition(Transition transition) {
        stateTransitionMap.put(transition.getFromState(), transition.getInputSymbol(), transition.getToState());
        symbolTransitionMap.put(transition.getFromState(), transition.getInputSymbol(), transition.getOutputSymbol());
    }

    public void start() {
        inputReader.start();
        outputWriter.start();
        machineRunner.start();
    }

    public void stop() {
        inputReader.stop();
        outputWriter.stop();
        machineRunner.interrupt();
    }

    private void loop() {
        StringBuilder builder = new StringBuilder();
        builder.append("START");

        while (true) {
            try {
                builder.append(" -> (").append("STATE: ").append(m_CurrentState.getName()).append(", INPUT: ");

                System.out.print(builder);

                InputSymbol input = inputQueue.take();
                Symbol inputSymbol = input.getSymbol();
                System.out.println(input.getSymbol().getName());

                Symbol output = getOutputSymbol(m_CurrentState, inputSymbol);
                outputQueue.put(output);
                builder.append(inputSymbol.getName()).append(", ").append("OUTPUT: ").append(output.getName()).append(")");
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
        return symbolTransitionMap.get(currentState, input);
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
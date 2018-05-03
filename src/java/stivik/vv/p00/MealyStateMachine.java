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
import java.util.logging.Level;
import java.util.logging.Logger;

public class MealyStateMachine {
    private static final Logger LOGGER = Logger.getLogger( MealyStateMachine.class.getName() );

    private Thread machineRunner;
    private BlockingQueue<InputSymbol> inputQueue;
    private BlockingQueue<Symbol> outputQueue;
    private MealyInputReader inputReader;
    private MealyOutputWriter outputWriter;
    private TransitionMap<State> stateTransitionMap = new TransitionMap<>();
    private TransitionMap<Symbol> symbolTransitionMap = new TransitionMap<>();
    private State currentState;

    MealyStateMachine(State[] states, Symbol[] symbols) {
        currentState = states[0];

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
        while (true) {
            try {
                Symbol input = inputQueue.take().getSymbol();
                if(input == null) {
                    LOGGER.log(Level.WARNING, "Read invalid input symbol!");
                    continue;
                }

                State next = getNextState(currentState, input);
                if (next == null) {
                    LOGGER.log(Level.WARNING, "State-Transition failed: STATE[" + currentState.getName() + "] + SYMBOL[" + input.getName() + "] -> undefined result!" );
                    continue;
                }
                LOGGER.log(Level.INFO, "Performed State-Transition: STATE[" + currentState.getName() + "] + SYMBOL[" + input.getName() + "] -> STATE[" + next.getName() + "]");

                Symbol output = getOutputSymbol(currentState, input);
                if(output == null) {
                    LOGGER.log(Level.WARNING, "Symbol-Transition failed: STATE[" + currentState.getName() + "] + SYMBOL[" + input.getName() + "] -> undefined result!" );
                    continue;
                }
                LOGGER.log(Level.INFO, "Performed OutputSymbol-Transition: STATE[" + currentState.getName() + "] + SYMBOL[" + input.getName() + "] -> SYMBOL[" + output.getName() + "]");

                if(next.getIsEnd()) {
                    LOGGER.log(Level.INFO, "Reached end state! Exiting...");
                    break;
                }

                outputQueue.put(output);
                currentState = next;
            } catch (InterruptedException e) {
                LOGGER.log(Level.INFO, "Received termination signal! Exiting...");
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

    public static void main(String[] args) throws JAXBException {
        MealyStateMachine machine = MealyStateMachineFactory.build(XMLMealyParser.parse(new File("resources/machine.xml")));
        machine.start();
    }
}
package stivik.vv.p00;

import stivik.vv.p00.parser.XMLMealyParser;
import stivik.vv.p00.util.TransitionFunction;
import stivik.vv.p00.util.TransitionMap;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.util.Scanner;

public class MealyStateMachine {

    private TransitionMap<State> m_StateTransitionMap = new TransitionMap<>();
    private TransitionMap<TransitionFunction<State, Symbol, Symbol>> m_SymbolTransitionMap = new TransitionMap<>();

    private Scanner m_InputReader = new Scanner(System.in);
    private State m_CurrentState;
    private State[] m_States;
    private Symbol[] m_Symbols;

    public MealyStateMachine(State[] states, Symbol[] symbols) {
        m_States = states;
        m_Symbols = symbols;
        m_CurrentState = m_States[0];
    }

    public void run() {
        StringBuilder builder = new StringBuilder();
        builder.append("START");
        while(true) {
            builder.append(" -> (").append("STATE: ").append(m_CurrentState.m_Name).append(", INPUT: ");

            System.out.print(builder);

            int input = m_InputReader.nextInt();

            builder.append(input).append(", ").append("OUTPUT: ").append(trigger(m_CurrentState, m_Symbols[input]).m_Name).append(")");
            m_CurrentState = next(m_CurrentState, m_Symbols[input]);
            if (m_CurrentState.m_End) {
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

    public static void main(String[] args) throws JAXBException {
        /*
        State[] states = { new State("S_i"), new State("S_0"), new State("S_1"), new State("S_2"), new State("S_3", true) };
        Symbol[] symbols = { new Symbol("0"), new Symbol("1"), new Symbol("2") };

        MealyStateMachine machine = new MealyStateMachine(states, symbols);
        machine.m_StateTransitionMap.put(states[0], symbols[0], states[1]);
        machine.m_StateTransitionMap.put(states[0], symbols[1], states[2]);
        machine.m_StateTransitionMap.put(states[1], symbols[0], states[1]);
        machine.m_StateTransitionMap.put(states[1], symbols[1], states[2]);
        machine.m_StateTransitionMap.put(states[2], symbols[0], states[1]);
        machine.m_StateTransitionMap.put(states[2], symbols[1], states[2]);

        machine.m_StateTransitionMap.put(states[2], symbols[2], states[4]);

        machine.m_SymbolTransitionMap.put(states[0], symbols[0], (symbol, state) -> symbols[0]);
        machine.m_SymbolTransitionMap.put(states[0], symbols[1], (symbol, state) -> symbols[0]);
        machine.m_SymbolTransitionMap.put(states[1], symbols[0], (symbol, state) -> symbols[0]);
        machine.m_SymbolTransitionMap.put(states[1], symbols[1], (symbol, state) -> symbols[1]);
        machine.m_SymbolTransitionMap.put(states[2], symbols[0], (symbol, state) -> symbols[1]);
        machine.m_SymbolTransitionMap.put(states[2], symbols[1], (symbol, state) -> symbols[0]);
        machine.m_SymbolTransitionMap.put(states[2], symbols[2], (symbol, state) -> symbols[0]);
        machine.run();
        */

        /*
        File file = new File("machine.xml");
        XMLMealyParser parser = new XMLMealyParser();
        MealyStateMachineFile machineFile = parser.parse(file);
        MealyStateMachine machine = MealyStateMachineFactory.build(machineFile);
        machine.run();
        */

        MealyStateMachineFile machineFile = new MealyStateMachineFile();
        JAXBContext context = JAXBContext.newInstance(MealyStateMachineFile.class);
        Marshaller m = context.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
        m.marshal(machineFile, System.out);
        m.marshal(machineFile, new File("machine.xml"));

        Unmarshaller u = context.createUnmarshaller();
        MealyStateMachineFile mealyStateMachineFile = (MealyStateMachineFile) u.unmarshal(new File("machine.xml"));
        System.out.println(mealyStateMachineFile.states[0] == mealyStateMachineFile.transitions[0].fromState);
    }
}

/**
    java -jar mealy.jar -machine=./file.json -format=json -input=./input.txt -outputa   =./output.txt

    input.txt:
    "0,0,0,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,2"
 **/
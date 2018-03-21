package stivik.vv.p00;

public class Symbol {
    private static int lastId = 0;

    public int m_Id = ++Symbol.lastId;
    public String m_Name;

    public Symbol(String name) {
        m_Name = name;
    }
}

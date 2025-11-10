import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        System.out.println("Test");

        Helper hpr = new Helper("Hi");
        hpr.printMessage();

        int[] myArr = {9, 8, 7, 6, 5};

        for (int i = 0; i < myArr.length; i++) {
            System.out.print(myArr[i] + " ");
        }

        for (int i = 0; i <= 9; i++) {
            System.out.println(i);
        }

        System.out.println(Arrays.toString(myArr));
    }
}
package mycli;

import mycli.functions.MakeMigration;
import mycli.functions.MakeModel;

public class MyCli {
    public static void main(String[] args) {
        if (args.length < 2) {
            System.out.println("Usage: make:model <Name> or make:migration <Name>");
            return;
        }

        String command = args[0].trim().toLowerCase();
        String name = args[1];

        System.out.println("Command received: '" + command + "'");

        switch (command) {
            case "make:model" -> MakeModel.run(name);
            case "make:migration" -> MakeMigration.run(name);
            default -> System.out.println("Unknown command: " + command);
        }
    }
}

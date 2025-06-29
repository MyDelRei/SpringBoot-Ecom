package mycli.functions;

import java.io.IOException;
import java.nio.file.*;

public class MakeController {

    public static void run(String name) {
        String className = capitalize(name);
        String content = """
            package org.project.ecom.controller;

            import org.springframework.web.bind.annotation.*;
            import org.springframework.beans.factory.annotation.Autowired;

            @RestController
            @RequestMapping("/api/v1/%s")
            public class %sController {

               @RequestMapping("/%s")
               public string greet(){
               return "Hello World";
               }
            }
            """.formatted(className, className, name.toLowerCase(), className, className, name.toLowerCase(), className, name.toLowerCase(), className, name.toLowerCase());

        Path filePath = Paths.get("src/main/java/org/project/ecom/controller/" + className + "Controller.java");
        createFile(filePath, content);
    }

    private static void createFile(Path path, String content) {
        try {
            Files.createDirectories(path.getParent());
            Files.writeString(path, content, StandardOpenOption.CREATE_NEW);
            System.out.println("✅ Created: " + path);
        } catch (FileAlreadyExistsException e) {
            System.out.println("❌ File already exists: " + path);
        } catch (IOException e) {
            System.out.println("❌ Error creating file: " + path);
            e.printStackTrace();
        }
    }

    private static String capitalize(String str) {
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}

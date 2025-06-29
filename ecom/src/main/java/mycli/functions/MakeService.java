package mycli.functions;

import java.io.IOException;
import java.nio.file.*;

public class MakeService {

    public static void run(String name) {
        String className = capitalize(name);

        String serviceContent = """
            package org.project.ecom.service;

            import org.springframework.stereotype.Service;

            @Service
            public class %sService {
            
                @Autowired
                // your repo
                
                
                    // TODO: Add logic to create
            }
            """.formatted(className, className, className, className);

        Path path = Paths.get("src/main/java/org/project/ecom/service/" + className + "Service.java");
        createFile(path, serviceContent);
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

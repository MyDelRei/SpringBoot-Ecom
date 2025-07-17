package mycli.functions;

import java.io.IOException;
import java.nio.file.*;

public class MakeDto {

    public static void run(String name) {
        String className = capitalize(name);

        String dtoContent = """
            package org.project.dto;

            import lombok.Data;

            @Data
            public class %sDto {
                private Long id;
                private String name;
                // Add more fields as needed
            }
            """.formatted(className);

        Path path = Paths.get("src/main/java/org/project/ecom/model/dto/" + className + "Dto.java");
        createFile(path, dtoContent);
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

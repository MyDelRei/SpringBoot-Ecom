package mycli.functions;

import java.io.IOException;
import java.nio.file.*;
import java.util.Comparator;
import java.util.Optional;
import java.util.regex.*;

public class MakeMigration {

    private static final String MIGRATION_DIR = "src/main/resources/db/migration/";

    public static void run(String migrationName) {
        try {
            Files.createDirectories(Paths.get(MIGRATION_DIR));

            int nextVersion = getNextMigrationVersion();
            String fileName = "V" + nextVersion + "__" + toSnakeCase(migrationName) + ".sql";
            Path filePath = Paths.get(MIGRATION_DIR + fileName);

            String template = "-- Migration: " + migrationName + "\n-- Write your SQL here\n" +
                    "ALTER TABLE --tablename-- ADD COLUMN --fieldname--";

            Files.writeString(filePath, template);
            System.out.println("✅ Created migration: " + filePath);

        } catch (IOException e) {
            System.err.println("❌ Failed to create migration file");
            e.printStackTrace();
        }
    }

    private static int getNextMigrationVersion() throws IOException {
        if (!Files.exists(Paths.get(MIGRATION_DIR))) {
            return 1;
        }

        Optional<Integer> maxVersion = Files.list(Paths.get(MIGRATION_DIR))
                .map(Path::getFileName)
                .map(Path::toString)
                .map(MakeMigration::extractVersion)
                .filter(v -> v != -1)
                .max(Comparator.naturalOrder());

        return maxVersion.orElse(0) + 1;
    }

    private static int extractVersion(String filename) {
        Matcher m = Pattern.compile("^V(\\d+)__.*\\.sql$").matcher(filename);
        return m.find() ? Integer.parseInt(m.group(1)) : -1;
    }

    private static String toSnakeCase(String input) {
        return input
                .replaceAll("([a-z])([A-Z])", "$1_$2")
                .replaceAll("[\\s-]+", "_")
                .toLowerCase();
    }
}

# Use Oracle's official Free Express Edition image as the base
# This image contains a full Oracle 21c XE database installation.
FROM gvenzl/oracle-xe:21-slim

# Oracle's default port is 1521
EXPOSE 1521

# The Oracle base image will automatically run any .sh or .sql files
# placed in the /container-entrypoint-initdb.d directory on first startup.
# We will copy our custom SQL script there to set up the user for Laravel.
COPY init.sql /container-entrypoint-initdb.d/

# The HEALTHCHECK instruction tells Docker how to test the container
# to check that it is not just running, but working correctly.
# It uses 'tnsping' to ensure the database instance (XE) is responsive.
# This is crucial for docker-compose to know when the database is ready.
HEALTHCHECK --interval=10s --timeout=5s --start-period=1m \
  CMD tnsping XE || exit 1

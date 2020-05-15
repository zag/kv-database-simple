
## Start containers

  docker-compose up

## Commands format 

   `<command> <key> [<value>]`

Example:

    SET  1  1
    DELETE  1 
    GET  5

## Journals and snapshots 

snapshots:

 `data/*-snapshot.json`

journal 
 `data/journal.log`

## Configuration

   `check src/config`

or via ENV

      RMQ_HOST=rabbitmq
      INCOME_QUEUE=in
      OUTCOME_QUEUE=out
      DATA_PATH=/app/data

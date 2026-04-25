#!/bin/bash
set -euo pipefail

echo "=== affexaiFactory Backup Script ==="
echo "Starting backup at $(date -u)"

BACKUP_DIR="${BACKUP_DIR:-/tmp/affex-backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# PostgreSQL backup
if command -v pg_dump &>/dev/null; then
	echo "Backing up PostgreSQL..."
	PGHOST="${PGHOST:-localhost}"
	PGPORT="${PGPORT:-5432}"
	PGUSER="${PGUSER:-affex}"
	PGDATABASE="${PGDATABASE:-affex}"
	
	pg_dump \
		-h "$PGHOST" \
		-p "$PGPORT" \
		-U "$PGUSER" \
		"$PGDATABASE" \
		> "$BACKUP_DIR/postgres_${TIMESTAMP}.sql"
	
	echo "PostgreSQL backup saved to $BACKUP_DIR/postgres_${TIMESTAMP}.sql"
else
	echo "pg_dump not found, skipping PostgreSQL backup"
fi

# Redis backup (BGSAVE + copy)
if command -v redis-cli &>/dev/null; then
	echo "Backing up Redis..."
	redis-cli BGSAVE
	sleep 2
	REDIS_DIR=$(redis-cli CONFIG GET dir | tail -1)
	REDIS_FILE=$(redis-cli CONFIG GET dbfilename | tail -1)
	
	if [ -f "$REDIS_DIR/$REDIS_FILE" ]; then
		cp "$REDIS_DIR/$REDIS_FILE" "$BACKUP_DIR/redis_${TIMESTAMP}.rdb"
		echo "Redis backup saved to $BACKUP_DIR/redis_${TIMESTAMP}.rdb"
	else
		echo "Redis dump file not found, skipping"
	fi
else
	echo "redis-cli not found, skipping Redis backup"
fi

# Clean old backups (keep last 7 days)
echo "Cleaning backups older than 7 days..."
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.rdb" -mtime +7 -delete

echo "Backup completed at $(date -u)"
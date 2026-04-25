#!/bin/bash
set -euo pipefail

echo "=== affexaiFactory Restore Script ==="
echo "Starting restore at $(date -u)"

BACKUP_DIR="${BACKUP_DIR:-/tmp/affex-backups}"

# List available backups
echo "Available PostgreSQL backups:"
ls -la "$BACKUP_DIR"/postgres_*.sql 2>/dev/null || echo "No PostgreSQL backups found"

echo "Available Redis backups:"
ls -la "$BACKUP_DIR"/redis_*.rdb 2>/dev/null || echo "No Redis backups found"

# PostgreSQL restore
if [ -n "${PG_BACKUP:-}" ]; then
	if [ -f "$BACKUP_DIR/$PG_BACKUP" ]; then
		echo "Restoring PostgreSQL from $PG_BACKUP..."
		PGHOST="${PGHOST:-localhost}"
		PGPORT="${PGPORT:-5432}"
		PGUSER="${PGUSER:-affex}"
		PGDATABASE="${PGDATABASE:-affex}"
		
		psql \
			-h "$PGHOST" \
			-p "$PGPORT" \
			-U "$PGUSER" \
			-d "$PGDATABASE" \
			< "$BACKUP_DIR/$PG_BACKUP"
		
		echo "PostgreSQL restore completed"
	else
		echo "Backup file not found: $PG_BACKUP"
		exit 1
	fi
else
	echo "No PG_BACKUP specified, skipping PostgreSQL restore"
	echo "Set PG_BACKUP=<filename> to restore a specific backup"
fi

echo "Restore completed at $(date -u)"
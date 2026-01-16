#!/bin/bash
# postCreate.sh: Script to run after devcontainer is created
# This script runs the database migration

npm run migrate

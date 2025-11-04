FROM python:3.11-slim

WORKDIR /app

COPY scripts/ /app/scripts/
COPY tests/ /app/tests/
COPY Makefile /app/Makefile

EXPOSE 8089

CMD ["python", "-m", "scripts.user_guide_automation.api"]


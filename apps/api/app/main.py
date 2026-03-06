from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import settings
from app.schemas import ErrorResponse
from app.services.errors import DomainError

app = FastAPI(title="Scrambling API", version="0.2.0")


@app.exception_handler(DomainError)
async def domain_error_handler(_: Request, exc: DomainError) -> JSONResponse:
    payload = ErrorResponse(code=exc.code, message=exc.message, details=exc.details)
    return JSONResponse(status_code=exc.status_code, content=payload.model_dump())


app.include_router(api_router, prefix=settings.api_v1_prefix)

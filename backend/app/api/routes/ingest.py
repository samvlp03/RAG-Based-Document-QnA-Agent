from fastapi import APIRouter, UploadFile, File, HTTPException
from app.ingestion.pipeline import ingest_file
from app.utils.file_utils import save_upload_file
import traceback

router = APIRouter()

@router.post("/ingest")
async def ingest(file: UploadFile = File(...)):
    try:
        file_path = await save_upload_file(file)

        try:
            result = ingest_file(file_path, metadata={"filename": file.filename})
            return result
        except Exception as e:
            traceback.print_exc()
            return {"error": str(e)}

        return {
            "message": "File ingested successfully",
            **result
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
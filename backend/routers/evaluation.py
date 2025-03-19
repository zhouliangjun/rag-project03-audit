from fastapi import APIRouter, File, Form, UploadFile, HTTPException
from services.evaluation_service import EvaluationService
from typing import Dict, Any

router = APIRouter()

@router.post("/evaluate")
async def evaluate_search(
    file: UploadFile = File(...),
    collection_id: str = Form(...),
    top_k: int = Form(10),
    threshold: float = Form(0.7)
) -> Dict[str, Any]:
    """
    评估搜索结果的端点
    
    参数:
        file: 包含评估数据的CSV文件
        collection_id: 要搜索的集合ID
        top_k: 返回的最大结果数
        threshold: 相似度阈值
    
    返回:
        包含评估结果的字典
    """
    try:
        file_content = await file.read()
        evaluation_service = EvaluationService()
        
        results = await evaluation_service.process_evaluation(
            file_content=file_content,
            collection_id=collection_id,
            top_k=top_k,
            threshold=threshold
        )
        
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
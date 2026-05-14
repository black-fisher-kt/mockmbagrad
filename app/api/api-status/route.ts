import { NextRequest, NextResponse } from "next/server";
import { getApiStatus, getActiveApi, setActiveApi, rotateToNextApi, resetToPrimary } from '@/lib/api-failover';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      currentApi: getActiveApi(),
      status: getApiStatus(),
      totalEndpoints: 3
    });
  } catch (error) {
    console.error("Error getting API status:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to get API status" 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'rotate') {
      rotateToNextApi();
      return NextResponse.json({
        success: true,
        message: "API rotated",
        currentApi: getActiveApi()
      });
    } else if (body.action === 'reset') {
      resetToPrimary();
      return NextResponse.json({
        success: true,
        message: "API reset to primary",
        currentApi: getActiveApi()
      });
    } else if (body.action === 'set') {
      const index = body.index;
      if (index !== undefined && index >= 0 && index < 3) {
        setActiveApi(index);
        return NextResponse.json({
          success: true,
          message: `API set to index ${index}`,
          currentApi: getActiveApi()
        });
      } else {
        return NextResponse.json({
          success: false,
          error: "Invalid index. Must be 0, 1, or 2"
        }, { status: 400 });
      }
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid action. Use 'rotate', 'reset', or 'set'"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Error managing API:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to manage API" 
    }, { status: 500 });
  }
}
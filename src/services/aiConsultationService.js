/**
 * AI Consultation Service - Mock LLM Integration for Health Chat
 * Simulates a conversational AI analyzing health data
 */

// Simulated delay for "thinking"
const THINKING_DELAY = 1000;

/**
 * Process a user query with context data and return an AI response
 * @param {string} query - The user's question
 * @param {Object} contextData - Daily health data (heart rate, arrhythmia, etc.)
 * @returns {Promise<Object>} Response object with text and metadata
 */
export async function sendConsultationQuery(query, contextData) {
  await new Promise(resolve => setTimeout(resolve, THINKING_DELAY));

  if (!query) {
    return {
      text: "안녕하세요. 무엇을 도와드릴까요?",
      type: "greeting"
    };
  }

  // Keywords analysis (Mock Logic)
  const lowerQuery = query.toLowerCase();
  
  // 1. Heart Rate / Pulse Questions
  if (lowerQuery.includes('심박수') || lowerQuery.includes('맥박') || lowerQuery.includes('heart')) {
    const avgBpm = contextData?.heartRate?.avg || 0;
    const maxBpm = contextData?.heartRate?.max || 0;
    
    if (lowerQuery.includes('왜') || lowerQuery.includes('높아') || lowerQuery.includes('높은')) {
        if (avgBpm > 100) {
            return {
                text: `오늘 평균 심박수가 ${avgBpm} BPM으로 평소보다 다소 높게 측정되었습니다. 스트레스나 카페인 섭취, 혹은 격렬한 운동이 원인일 수 있습니다. 충분한 휴식을 취하시는 것을 권장합니다.`,
                relatedData: { type: 'heartRate', value: avgBpm }
            };
        } else if (maxBpm > 120) {
             return {
                text: `오늘 전반적인 심박수는 안정적이나, 일시적으로 최고 ${maxBpm} BPM까지 상승한 구간이 있습니다. 특정 활동 중 발생한 자연스러운 현상인지 확인해보세요.`,
                relatedData: { type: 'heartRate', value: maxBpm, detail: 'max' }
            };
        } else {
             return {
                text: `오늘 심박수는 평균 ${avgBpm} BPM으로 매우 안정적인 범위 내에 있습니다. 특별히 걱정하실 부분은 보이지 않습니다.`,
                relatedData: { type: 'heartRate', value: avgBpm }
            };
        }
    }
    
    return {
        text: `오늘의 평균 심박수는 ${avgBpm} BPM이며, 최고 심박수는 ${maxBpm} BPM입니다. 전반적으로 정상 범위를 유지하고 있습니다.`,
         relatedData: { type: 'heartRate', value: avgBpm }
    };
  }

  // 2. Arrhythmia / Abnormal Beats
  if (lowerQuery.includes('부정맥') || lowerQuery.includes('비정상')) {
    const abnormalCount = contextData?.abnormalBeats || 0;
    
    if (abnormalCount > 50) {
        return {
            text: `오늘 비정상 맥박이 ${abnormalCount}회 감지되었습니다. 이는 주의가 필요한 수준일 수 있습니다. 증상이 느껴지셨다면 '부정맥' 탭에서 상세 리포트를 확인하시거나 전문 의료진과 상담을 권장합니다.`,
            relatedData: { type: 'arrhythmia', value: abnormalCount }
        };
    } else if (abnormalCount > 0) {
         return {
            text: `비정상 맥박이 소량(${abnormalCount}회) 감지되었으나, 일상적인 활동 중에도 간혹 발생할 수 있는 수준입니다. 지속적으로 모니터링하겠습니다.`,
            relatedData: { type: 'arrhythmia', value: abnormalCount }
        };
    } else {
        return {
            text: "오늘 감지된 비정상 맥박은 없습니다. 심장 리듬이 매우 규칙적입니다.",
            relatedData: { type: 'arrhythmia', value: 0 }
        };
    }
  }

  // 3. Stress
  if (lowerQuery.includes('스트레스') || lowerQuery.includes('피곤')) {
      // Mock stress logic assuming we have stress data or default to safe response
      // In a real app, we'd check contextData.stress
      return {
          text: "심박변동성(HRV) 데이터를 분석해보면, 현재 신체적 스트레스 수준은 '보통'입니다. 가벼운 스트레칭이나 명상이 도움이 될 수 있습니다.",
          relatedData: { type: 'stress' }
      };
  }

  // Default Fallback
  return {
    text: "죄송합니다. 제가 이해하기 어려운 질문이네요. 심박수, 부정맥, 또는 전반적인 건강 상태에 대해 물어봐 주세요.",
    type: "fallback"
  };
}

export default {
    sendConsultationQuery
};

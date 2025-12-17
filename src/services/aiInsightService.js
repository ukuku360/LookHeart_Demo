// AI Insight Service - Mock LLM Integration
// In production, this would call an actual LLM API

/**
 * Generate a daily health insight based on 6 health metrics
 * @param {Object} dailyData - Daily health data from mockData
 * @returns {Promise<Object>} AI-generated insight
 */
export async function generateDailyInsight(dailyData) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!dailyData) {
    return {
      emoji: '📊',
      summary: '오늘의 건강 데이터가 아직 수집되지 않았어요.',
      status: 'no_data',
      details: null,
    };
  }

  // Analyze the data and generate appropriate insight
  const insight = analyzeHealthData(dailyData);
  return insight;
}

/**
 * Analyze health data and generate an insight
 * (Mock LLM response - in production, this would be the LLM output)
 */
function analyzeHealthData(data) {
  const { heartRate, hrv, abnormalBeats, stress, calories, steps } = data;

  // Calculate overall health score (simplified)
  let score = 100;
  let concerns = [];
  let positives = [];

  // Heart Rate Analysis
  if (heartRate) {
    if (heartRate.avg > 100) {
      score -= 15;
      concerns.push('심박수가 평소보다 높아요');
    } else if (heartRate.avg >= 60 && heartRate.avg <= 80) {
      positives.push('심박수가 안정적이에요');
    }
  }

  // HRV Analysis
  if (hrv) {
    if (hrv.avg > 500) {
      positives.push('심박변동성이 양호해요');
    } else if (hrv.avg < 400) {
      score -= 10;
      concerns.push('심박변동성이 낮아요');
    }
  }

  // Abnormal Beats
  if (abnormalBeats !== undefined) {
    if (abnormalBeats > 100) {
      score -= 20;
      concerns.push('비정상 맥박이 많이 감지되었어요');
    } else if (abnormalBeats < 10) {
      positives.push('맥박이 규칙적이에요');
    }
  }

  // Stress Analysis
  if (stress) {
    const snsAvg = stress.sns?.avg || 50;
    if (snsAvg > 70) {
      score -= 10;
      concerns.push('스트레스 지수가 높아요');
    } else if (snsAvg < 50) {
      positives.push('스트레스 수준이 낮아요');
    }
  }

  // Steps Analysis
  if (steps !== undefined) {
    if (steps >= 10000) {
      positives.push('목표 걸음수를 달성했어요!');
    } else if (steps < 5000) {
      score -= 5;
      concerns.push('오늘 활동량이 적어요');
    }
  }

  // Calories Analysis
  if (calories) {
    if (calories.active > 500) {
      positives.push('활동 칼로리 소모가 좋아요');
    }
  }

  // Generate summary and details based on analysis
  return generateInsightResponse(score, positives, concerns, data);
}

/**
 * Generate the final insight response object
 */
function generateInsightResponse(score, positives, concerns, data) {
  let emoji, summary, status, recommendation;

  if (score >= 85) {
    emoji = '🌟';
    status = 'excellent';
    summary = positives.length > 0 
      ? `오늘 컨디션이 아주 좋아요! ${positives[0]}.`
      : '오늘 건강 상태가 매우 좋습니다!';
    recommendation = '현재 상태를 유지하면서 규칙적인 생활을 계속하세요.';
  } else if (score >= 70) {
    emoji = '👍';
    status = 'good';
    summary = positives.length > 0 
      ? `전반적으로 양호해요. ${positives[0]}.`
      : '건강 상태가 양호합니다.';
    recommendation = concerns.length > 0 
      ? `다만 ${concerns[0]}. 휴식을 취해보세요.`
      : '충분한 수분 섭취와 휴식을 권장합니다.';
  } else if (score >= 50) {
    emoji = '⚠️';
    status = 'caution';
    summary = concerns.length > 0 
      ? `주의가 필요해요. ${concerns[0]}.`
      : '건강 지표 일부가 정상 범위를 벗어났어요.';
    recommendation = '충분한 휴식과 스트레스 관리가 필요합니다. 증상이 지속되면 전문가 상담을 권장합니다.';
  } else {
    emoji = '🚨';
    status = 'warning';
    summary = '주의 깊은 관찰이 필요해요.';
    recommendation = '건강 상태가 불안정합니다. 무리하지 마시고 필요시 전문가와 상담하세요.';
  }

  return {
    emoji,
    summary,
    status,
    score,
    details: {
      positives,
      concerns,
      recommendation,
      metrics: {
        heartRate: data.heartRate?.avg || 0,
        hrv: data.hrv?.avg || 0,
        abnormalBeats: data.abnormalBeats || 0,
        stressSNS: data.stress?.sns?.avg || 0,
        steps: data.steps || 0,
        activeCalories: data.calories?.active || 0,
      }
    }
  };
}

export default {
  generateDailyInsight,
};

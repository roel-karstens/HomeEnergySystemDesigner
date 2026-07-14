export type AnalyzeRequest = {
  home: {
    home_type: string;
    construction_year: number;
    surface_area_m2: number;
    residents: number;
    energy_label: string;
    location: string;
  };
  energy_profile: {
    annual_household_kwh: number;
    annual_heat_demand_kwh: number;
    annual_km: number;
  };
  solar: { status: "fixed" | "optimize" | "excluded"; panel_count: number; panel_power_wp: number };
  heat_pump: { status: "fixed" | "optimize" | "excluded"; annual_heat_demand_kwh: number; seasonal_cop: number };
  ev: {
    status: "fixed" | "optimize" | "excluded";
    annual_km: number;
    consumption_kwh_per_km: number;
    charging_strategy: "normal" | "smart" | "v2g";
  };
  battery: { status: "fixed" | "optimize" | "excluded"; capacity_kwh: number; roundtrip_efficiency: number };
  optimization: {
    objective: "financial" | "independence" | "balanced";
    preferred_contract: "fixed" | "variable" | "dynamic";
  };
  goal: "financial" | "independence" | "balanced";
};

export type AnalyzeResponse = {
  recommendation: string;
  reasons: string[];
  annual_pv_kwh: number;
  annual_heat_pump_kwh: number;
  annual_ev_kwh: number;
  annual_battery_shifted_kwh: number;
  annual_household_kwh: number;
  annual_total_demand_kwh: number;
  annual_grid_import_kwh: number;
  self_sufficiency_ratio: number;
  estimated_grid_co2_kg: number;
  annual_grid_kwh_for_heat_pump: number;
  annual_cost_eur_for_heat_pump: number;
};

export type ValidationIssue = {
  code: string;
  message: string;
  field: string | null;
};

export type ValidateResponse = {
  valid: boolean;
  issues: ValidationIssue[];
};

export type ScenarioItem = {
  name: string;
  panel_count: number;
  annual_pv_kwh: number;
  annual_grid_import_kwh: number;
  self_sufficiency_ratio: number;
  annual_cost_eur_for_heat_pump: number;
};

export type ScenariosResponse = {
  scenarios: ScenarioItem[];
};

export type ConstraintResult = {
  name: string;
  target: number;
  actual: number;
  met: boolean;
};

export type OptimizationResponse = {
  objective: "financial" | "independence" | "balanced";
  recommendation: string;
  actions: string[];
  constraint_results: ConstraintResult[];
};

export type FinancialAnalysisResponse = {
  analysis_id: string;
  contract_type: "fixed" | "variable" | "dynamic";
  grid_buy_price_eur_per_kwh: number;
  feed_in_price_eur_per_kwh: number;
  annual_energy_cost_eur: number;
  annual_savings_vs_baseline_eur: number;
  simple_payback_years: number | null;
};

export type ExplainabilityResponse = {
  assumptions: string[];
  sensitivities: string[];
  confidence_note: string;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? `http://${window.location.hostname}:8000/api/v1`;

export async function analyze(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Analyze request failed: ${response.status}`);
  }
  return response.json() as Promise<AnalyzeResponse>;
}

export async function validateInput(payload: AnalyzeRequest): Promise<ValidateResponse> {
  const response = await fetch(`${API_BASE}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Validate request failed: ${response.status}`);
  }
  return response.json() as Promise<ValidateResponse>;
}

export async function getScenarios(payload: AnalyzeRequest): Promise<ScenariosResponse> {
  const response = await fetch(`${API_BASE}/scenarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Scenarios request failed: ${response.status}`);
  }
  return response.json() as Promise<ScenariosResponse>;
}

export async function getOptimization(payload: AnalyzeRequest): Promise<OptimizationResponse> {
  const response = await fetch(`${API_BASE}/optimization`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Optimization request failed: ${response.status}`);
  }
  return response.json() as Promise<OptimizationResponse>;
}

export async function getFinancialAnalysis(payload: AnalyzeRequest): Promise<FinancialAnalysisResponse> {
  const response = await fetch(`${API_BASE}/financial-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Financial request failed: ${response.status}`);
  }
  return response.json() as Promise<FinancialAnalysisResponse>;
}

export async function getExplainability(payload: AnalyzeRequest): Promise<ExplainabilityResponse> {
  const response = await fetch(`${API_BASE}/explainability`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Explainability request failed: ${response.status}`);
  }
  return response.json() as Promise<ExplainabilityResponse>;
}

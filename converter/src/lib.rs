use wasm_bindgen::prelude::*;
use serde_json::{Value, json};
use std::collections::HashMap;

#[wasm_bindgen]
pub fn transform(data: &str, mapping_rules: &str) -> String {
    let v: Value = serde_json::from_str(data).unwrap_or(json!({}));
    let rules: HashMap<String, String> = serde_json::from_str(mapping_rules).unwrap_or(HashMap::new());
    
    let mut result = json!({});
    
    for (target_key, source_path) in rules {
        if let Some(val) = get_value_by_path(&v, &source_path) {
            result[target_key] = val.clone();
        }
    }
    
    result.to_string()
}

fn get_value_by_path<'a>(value: &'a Value, path: &str) -> Option<&'a Value> {
    let mut current = value;
    for part in path.split('.') {
        if let Some(next) = current.get(part) {
            current = next;
        } else {
            return None;
        }
    }
    Some(current)
}

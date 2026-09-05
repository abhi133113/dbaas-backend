module.exports = [
  {
    name: "provision_database",
    description: "Provisions a new database cluster in the specified region.",
    parameters: {
      type: "OBJECT",
      properties: {
        cluster_name: { type: "STRING", "description": "Name of the cluster, e.g., staging-pg-01" },
        engine: { type: "STRING", "description": "Database engine, e.g., PostgreSQL 16" },
        region: { type: "STRING", "description": "Deployment region, e.g., eu-west-2" },
        instance_size: { type: "STRING", "description": "Size of the instance, e.g., db.m5.large" }
      },
      required: ["cluster_name", "engine"]
    }
  },
  {
    name: "analyze_database_health",
    description: "Diagnoses issues or analyzes the health of a specific database cluster.",
    parameters: {
      type: "OBJECT",
      properties: {
        cluster_name: { type: "STRING", "description": "Name of the cluster to analyze" }
      },
      required: ["cluster_name"]
    }
  },
  {
    name: "scale_database_cluster",
    description: "Scales a database cluster up or down to optimize cost or performance.",
    parameters: {
      type: "OBJECT",
      properties: {
        cluster_name: { type: "STRING", "description": "Name of the cluster" },
        target_size: { type: "STRING", "description": "The new target instance size" }
      },
      required: ["cluster_name", "target_size"]
    }
  }
];

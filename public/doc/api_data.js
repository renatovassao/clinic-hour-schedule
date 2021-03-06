define({ "api": [
  {
    "type": "get",
    "url": "/hours",
    "title": "List available hours",
    "group": "Hours",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>Start day (query)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>End day (query)</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"day\": \"26-03-2019\",\n    \"intervals\": [\n      {\n        \"start\": \"07:00\",\n        \"end\": \"08:00\"\n      }\n    ]\n  },\n  {\n    \"day\": \"27-03-2019\",\n    \"intervals\": [\n      {\n        \"start\": \"07:00\",\n        \"end\": \"08:00\"\n      },\n      {\n        \"start\": \"09:00\",\n       \"end\": \"10:00\"\n      },\n      {\n        \"start\": \"11:00\",\n        \"end\": \"12:00\"\n      }\n    ]\n  },\n  {\n    \"day\": \"28-03-2019\",\n    \"intervals\": [\n      {\n        \"start\": \"01:00\",\n        \"end\": \"02:00\"\n      },\n      {\n        \"start\": \"03:00\",\n        \"end\": \"04:00\"\n      },\n      {\n        \"start\": \"07:00\",\n        \"end\": \"08:00\"\n      }\n    ]\n  },\n  {\n    \"day\": \"29-03-2019\",\n    \"intervals\": [\n      {\n        \"start\": \"07:00\",\n        \"end\": \"08:00\"\n      },\n      {\n        \"start\": \"09:00\",\n        \"end\": \"10:00\"\n      },\n      {\n        \"start\": \"11:00\",\n        \"end\": \"12:00\"\n      }\n    ]\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"Invalid interval. Valid interval start and end format is: 'DD-MM-YYYY'\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/hours.js",
    "groupTitle": "Hours",
    "name": "GetHours"
  },
  {
    "type": "delete",
    "url": "/rules/:id",
    "title": "Delete rule",
    "group": "Rules",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Rule id</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n\"Rule ed1a92f0-51ab-11e9-9947-573867ed4f3d was deleted successfully.\"",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"Rule not found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rules.js",
    "groupTitle": "Rules",
    "name": "DeleteRulesId"
  },
  {
    "type": "get",
    "url": "/rules",
    "title": "List all rules",
    "group": "Rules",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rules",
            "description": "<p>List of rules</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rules.id",
            "description": "<p>Rule id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rules.rule_type",
            "description": "<p>Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rules.day",
            "description": "<p>Rule day</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer[]",
            "optional": false,
            "field": "rules.week_days",
            "description": "<p>Rule week days</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "rules.intervals",
            "description": "<p>Rule intervals</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rules.intervals.start",
            "description": "<p>Rule intervals start</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rules.intervals.end",
            "description": "<p>Rule intervals end</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": \"e5efe2d0-51a8-11e9-be65-6fb595927377\",\n    \"rule_type\": \"ONE_DAY\",\n    \"day\": \"28-03-2019\",\n    \"intervals\": [\n      {\n        \"start\": \"01:00\",\n        \"end\": \"02:00\"\n      },\n      {\n        \"start\": \"03:00\",\n        \"end\": \"04:00\"\n      }\n    ]\n  },\n  {\n    \"id\": \"ff8a8ce0-51a3-11e9-9459-7fd41a26fcac\",\n    \"rule_type\": \"DAILY\",\n    \"intervals\": [\n      {\n        \"start\": \"07:00\",\n        \"end\": \"08:00\"\n      }\n    ]\n  },\n  {\n    \"id\": \"ff8b0210-51a3-11e9-9459-7fd41a26fcac\",\n    \"rule_type\": \"WEEKLY\",\n    \"week_days\": [\n      1,\n      3,\n      5\n    ],\n    \"intervals\": [\n      {\n        \"start\": \"09:00\",\n        \"end\": \"10:00\"\n      },\n      {\n        \"start\": \"11:00\",\n        \"end\": \"12:00\"\n      }\n    ]\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rules.js",
    "groupTitle": "Rules",
    "name": "GetRules"
  },
  {
    "type": "get",
    "url": "/rules/:id",
    "title": "List one rule",
    "group": "Rules",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Rule id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Rule id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rule_type",
            "description": "<p>Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>Rule day</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer[]",
            "optional": false,
            "field": "week_days",
            "description": "<p>Rule week days</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "intervals",
            "description": "<p>Rule intervals</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "intervals.start",
            "description": "<p>Rule intervals start</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "intervals.end",
            "description": "<p>Rule intervals end</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"e5efe2d0-51a8-11e9-be65-6fb595927377\",\n  \"rule_type\": \"ONE_DAY\",\n  \"day\": \"28-03-2019\",\n  \"intervals\": [\n    {\n      \"start\": \"01:00\",\n      \"end\": \"02:00\"\n    },\n    {\n      \"start\": \"03:00\",\n      \"end\": \"04:00\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"Rule not found.\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rules.js",
    "groupTitle": "Rules",
    "name": "GetRulesId"
  },
  {
    "type": "post",
    "url": "/rules",
    "title": "Create rules",
    "group": "Rules",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "rule_type",
            "description": "<p>Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>Rule day (When rule_type is 'ONE_DAY', this parameter is required)</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer[]",
            "optional": false,
            "field": "week_days",
            "description": "<p>Rule week days (When rule_type is 'WEEKLY', this parameter is required)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object[]",
            "optional": false,
            "field": "intervals",
            "description": "<p>Rule intervals</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "intervals.start",
            "description": "<p>Rule intervals start</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "intervals.end",
            "description": "<p>Rule intervals end</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Rule id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "rule_type",
            "description": "<p>Rule type ('ONE_DAY', 'DAILY', 'WEEKLY')</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "day",
            "description": "<p>Rule day</p>"
          },
          {
            "group": "Success 200",
            "type": "Integer[]",
            "optional": false,
            "field": "week_days",
            "description": "<p>Rule week days</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "intervals",
            "description": "<p>Rule intervals</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "intervals.start",
            "description": "<p>Rule intervals start</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "intervals.end",
            "description": "<p>Rule intervals end</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success Response",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": \"e5efe2d0-51a8-11e9-be65-6fb595927377\",\n  \"rule_type\": \"ONE_DAY\",\n  \"day\": \"28-03-2019\",\n  \"intervals\": [\n    {\n      \"start\": \"01:00\",\n      \"end\": \"02:00\"\n    },\n    {\n      \"start\": \"03:00\",\n      \"end\": \"04:00\"\n    }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error Response",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"Invalid day. Valid date format id: 'DD-MM-YYYY'\"\n}",
          "type": "json"
        },
        {
          "title": "Error Response",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/rules.js",
    "groupTitle": "Rules",
    "name": "PostRules"
  }
] });

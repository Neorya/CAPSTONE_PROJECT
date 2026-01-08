import sys
import os

# Add api/src to path so we can import modules
sys.path.append(os.path.abspath("api/src"))

from models import MatchSetting, Test, TestScope, Teacher
from match_settings_api import MatchSettingResponse
from pydantic import ValidationError

def verify_models():
    print("Verifying Models...")
    try:
        # Create a mock MatchSetting object
        mock_setting = MatchSetting(
            match_set_id=1,
            title="Test Match Setting",
            description="A test description",
            is_ready=True,
            reference_solution="print('hello')",
            creator_id=1,
            tests=[
                Test(test_id=1, test="input 1", scope=TestScope.public, match_set_id=1),
                Test(test_id=2, test="input 2", scope=TestScope.private, match_set_id=1)
            ]
        )
        print("Successfully created MatchSetting object with Tests.")
        
        # Verify Pydantic Schema
        print("\nVerifying Pydantic Schema...")
        response = MatchSettingResponse.model_validate(mock_setting)
        print("Successfully validated with Pydantic model.")
        print("Serialized Data:")
        print(response.model_dump_json(indent=2))

        # Check fields
        assert len(response.tests) == 2
        assert response.tests[0].scope == TestScope.public
        assert response.tests[1].scope == TestScope.private
        print("\nAll assertions passed!")

    except ValidationError as e:
        print(f"Pydantic Validation Error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_models()

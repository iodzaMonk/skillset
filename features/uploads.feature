Feature: Uploading files
  The upload API should accept files and report errors for invalid inputs.

  Scenario: Successfully uploading an image
    When I upload the following file:
      | name       | type      | content    |
      | avatar.png | image/png | fake-bytes |
    Then the upload response status should be 201
    And the upload response should include a key

  Scenario: Missing file payload
    When I upload without a file
    Then the upload response status should be 400
    And the upload error message should contain "Missing file upload payload"

  Scenario: Upload infrastructure failure
    Given uploads will fail with the message "S3 unavailable"
    When I upload the following file:
      | name | type       | content |
      | doc  | text/plain | data    |
    Then the upload response status should be 500
    And the upload error message should contain "File upload failed"

  Scenario: Capturing upload payload metadata
    Given I capture upload payloads
    When I upload the following file:
      | name        | type        | content        |
      | profile.jpg | image/jpeg  | avatar-bytes   |
    Then the upload response status should be 201
    And the upload response should include a key
    And the captured upload payload should include:
      | originalName | contentType | content      |
      | profile.jpg  | image/jpeg  | avatar-bytes |

  Scenario: Defaulting content type when omitted
    Given I capture upload payloads
    When I upload the following file:
      | name    | content         |
      | raw.bin | raw-byte-data   |
    Then the upload response status should be 201
    And the upload response should include a key
    And the captured upload payload should include:
      | originalName | contentType               | content       |
      | raw.bin      | application/octet-stream  | raw-byte-data |
    And the captured upload payload size should be 13 bytes

  Scenario: Generated upload keys use image prefix
    When I upload the following file:
      | name       | type       | content     |
      | banner.png | image/png  | banner-data |
    Then the upload response status should be 201
    And the upload key should start with "images/"

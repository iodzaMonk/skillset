Feature: Authentication
  To access Skillset securely, returning users must be able to sign in.

  Background:
    Given the following users exist:
      | email            | password    |
      | user@example.com | correctpass |

  Scenario: Signing in with valid credentials
    When I attempt to sign in with email "user@example.com" and password "correctpass"
    Then the response status should be 200
    And I should receive a session token

  Scenario: Signing in with a non-existent user
    When I attempt to sign in with email "ghost@example.com" and password "whatever"
    Then the response status should be 401
    And I should be told "Invalid credentials"

  Scenario: Signing in with an invalid password
    When I attempt to sign in with email "user@example.com" and password "wrongpass"
    Then the response status should be 401
    And I should be told "Invalid credentials"

  Scenario: Signing in without providing a password
    When I attempt to sign in with email "user@example.com" and password ""
    Then the response status should be 400
    And I should be told "Missing required fields: password"

  Scenario: Signing in without providing any credentials
    When I attempt to sign in with email "" and password ""
    Then the response status should be 400
    And I should be told "Missing required fields: email, password"

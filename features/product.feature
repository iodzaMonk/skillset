Feature: Product details
  Visitors should be able to retrieve a single product by slug and see its summary data.

  Background:
    Given the product catalogue includes:
      | title                | category | price | description       |
      | Video Editing Basics | Editing  |   120 | Learn quick edits |

  Scenario: Fetching an existing product
    When I request the product details for "Video Editing Basics"
    Then the product response status should be 200
    And the product payload should include title "Video Editing Basics"
    And the product payload should include category "Editing"
    And the product payload should include price 120
    And the product payload should include the placeholder image

  Scenario: Viewing product reviews
    And the product has the following reviews:
      | product              | reviewer | reviewer country | reviewer email       | text              | rating |
      | Video Editing Basics | Alice    | Canada           | alice@example.com    | Loved the lessons |      5 |
      | Video Editing Basics | Bob      | Brazil           | bob.prof@example.com | Helpful shortcuts |      4 |
    When I request the product details for "Video Editing Basics"
    Then the product response status should be 200
    And the product payload should include the following reviews:
      | reviewer | text              |
      | Alice    | Loved the lessons |
      | Bob      | Helpful shortcuts |
    And the product review metadata should include:
      | reviewer | country | email                |
      | Alice    | Canada  | alice@example.com    |
      | Bob      | Brazil  | bob.prof@example.com |
    And the product payload should report rating 4.5
    And the product payload should report 2 reviews

  Scenario: Viewing seller information
    Given the product catalogue includes:
      | title          | category | price | description | owner name | owner country | owner email       |
      | Premium Design | Design   |   500 | Brand kit   | Carla M.   | Spain         | carla@sellers.com |
    When I request the product details for "Premium Design"
    Then the product response status should be 200
    And the product payload should include seller:
      | name     | country | email             |
      | Carla M. | Spain   | carla@sellers.com |

  Scenario: Fetching a missing product
    When I request the product details for slug "missing-product-id"
    Then the product response status should be 404
    And the product error should say "Product not found"

  Scenario: Fetching with an invalid slug format
    When I request the product details for slug ""
    Then the product response status should be 400
    And the product error should say "Invalid product ID"

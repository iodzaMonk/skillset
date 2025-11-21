Feature: Product management CRUD
  Authenticated users should be able to create, update, list, and delete their products via the API.

  Scenario: Creating a product successfully
    Given I am authenticated for product management
    When I create a product with:
      | title       | description        | price | image_location |
      | Quick Edit  | Fast video edits   | 150   | uploads/key    |
    Then the product request should have status 201
    And the product response payload should include:
      | title      | description      | price |
      | Quick Edit | Fast video edits | 150   |

  Scenario: Failing validation when creating a product
    Given I am authenticated for product management
    When I create a product with:
      | title | description | price |
      |       |             |  -10  |
    Then the product request should have status 400
    And the product error message should contain "Title is required"
    And the product error message should contain "Description is required"
    And the product error message should contain "greater than or equal to 0"

  Scenario: Rejecting product creation without authentication
    Given I am not authenticated for product management
    When I create a product with:
      | title      | description | price |
      | Unauthorized | Test      | 50    |
    Then the product request should have status 401
    And the product error message should contain "Not authenticated"

  Scenario: Updating my product
    Given I am authenticated for product management
    And the following products already exist for me:
      | title        | description     | price |
      | Starter Edit | Initial desc    | 200   |
    When I update the product titled "Starter Edit" with:
      | title        | description      | price |
      | Starter Edit | Updated overview | 250   |
    Then the product request should have status 200
    And the product response payload should include:
      | title        | description      | price |
      | Starter Edit | Updated overview | 250   |

  Scenario: Updating a missing product returns 404
    Given I am authenticated for product management
    When I update the product titled "Missing Product" with:
      | description | price |
      | Nothing     |  10   |
    Then the product request should have status 404
    And the product error message should contain "Product not found"

  Scenario: Listing only my products
    Given I am authenticated for product management
    And the following products already exist for me:
      | title         | description  | price |
      | My Video Pack | Bundle info  | 90    |
      | Audio Boost   | Audio info   | 40    |
    And another user owns the following products:
      | title        | description | price |
      | Foreign Pack | Hidden      | 80    |
    When I list my products
    Then the product request should have status 200
    And the product list should include titles:
      | title         |
      | My Video Pack |
      | Audio Boost   |

  Scenario: Deleting my product
    Given I am authenticated for product management
    And the following products already exist for me:
      | title        | description | price |
      | Temp Product | Temp desc   | 60    |
    When I delete the product titled "Temp Product"
    Then the product request should have status 200
    And the product message should be "Product deleted"
    When I list my products
    Then the product list should be empty

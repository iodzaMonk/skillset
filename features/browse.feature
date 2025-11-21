Feature: Browse catalogue
  Marketplace visitors should be able to see available products and filter by category.

  Background:
    Given the catalogue contains the following products:
      | title                | category  | price |
      | Video Editing Basics | Editing   |   120 |
      | Logo Design Starter  | Design    |   200 |
      | Podcast Voice Pack   | Voiceover |    90 |

  Scenario: Viewing all products
    When I fetch the browse catalogue
    Then I should see 3 products
    And the product titles should include:
      | title                |
      | Video Editing Basics |
      | Logo Design Starter  |
      | Podcast Voice Pack   |

  Scenario Outline: Filtering by category
    When I filter the browse catalogue by "<category>"
    Then I should see <count> products
    And every product category should be "<category>"

    Examples:
      | category  | count |
      | Editing   |     1 |
      | Design    |     1 |
      | Voiceover |     1 |

  Scenario: Filtering to a category with no matches
    When I filter the browse catalogue by "Music"
    Then I should be told there are no products

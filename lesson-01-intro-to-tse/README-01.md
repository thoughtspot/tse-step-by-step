# Lesson 1: Introduction to ThoughtSpot Embedded

In this lesson we are going to cover the following:

* What is ThoughtSpot Embedding and why should you use it?
* The developer and administrator role in ThoughtSpot.

## What is TSE and why should you use it?

ThoughtSpot Embedded (aka TSE) is an umbrella term for the ability to embed ThoughtSpot capabilities into your
applications.  "Embed" includes visual components (such as embedded search), coordinating with ThoughtSpot via web
services, and the ability to push TS data to other applications.

![Embedding options with TSE](images/tse-options.png "TSE Options")

ThoughtSpot Embedded has the following benefits:

* Provide more than static dashboards with the full power of ThoughtSpot - users are able to ask natural language
  questions about their data, explore, drill anywhere,
  and interact with data to answer the next question they have without relying on analysts to create new reports and
  dashboards.
* Minimal coding is required to embed ThoughtSpot using our Visual SDK and Developer's Playground - developers can
  generate code that
  can be copied directly into applications and then tweaked for dynamic behavior. Concept to embedding takes minutes,
  not days.
* Analysts create analytics, developers create software - with TSE there's no long requirements cycle for dashboards
  where an analyst defines the requirements, developers code, and the review cycle begins. Analysts create content and
  developers simply embed.
* Empower users to explore their own data and then take action on the results - not only can users ask questions of
  data, but with Custom Actions and ThoughtSpot sync, users can send the data to other applications and targets,
  allowing you to fully operationalize your analytics.

## The developer and admin role

There are two important roles to understand when developing with ThoughtSpot Embedded. The first role is the _
_Developer__, who has access to the Developer's portal in the UI. This portal provides documentation, settings, and
Playgrounds for generating visual embed code and REST API calls. The Developer's portal and SDK is what makes it so easy
to work with
ThoughtSpot Embedded.

The __Admin__ role, has the same privileges as the Developer, but can also modify security settings and create users and
groups. Typically, most developers will have the Developer role and will work with an administrator to set up security.

![Developer playground](images/playground.png "Using the playground to generate code.")

## Activities

1. If you don't already have one, create a [ThoughtSpot Account](https://www.thoughtspot.com/trial?tsref=ts-dev-training).

[next >](../lesson-02-setting-up/README-02.md)